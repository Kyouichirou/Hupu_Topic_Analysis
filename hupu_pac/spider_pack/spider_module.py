__all__ = ['Spider']

import msvcrt
import threading
from ..log_module import Logs
from .metadata_module import Meta
from .crawler_module import Crawler
from .db_instance_module import Instance

_logger = Logs()


# @description: 最新回复18页, 24小时最热10页, 最新回复: 20

class Spider:
    def __init__(self):
        self._stop_flag = False
        # 最新发布
        self._recent_post = {
            'url': 'https://bbs.hupu.com/topic-daily-postdate',
            'end_page': 18
        }
        # 24小时最热
        self._daily_hot = {
            'url': 'https://bbs.hupu.com/topic-daily-postdate',
            'end_page': 10
        }
        # 最新回复
        self._recent_response = {
            'url': 'https://bbs.hupu.com/topic-daily',
            'end_page': 20
        }
        self._meta = Meta()
        self._crawler = Crawler()
        self._crawler.initial()
        self._control()
        self._db_instance = Instance()

    def _send_request(self, target: dict):
        url, end_page = target.values()
        refer = ''
        # 第一次请求请求后之后的请求头的差异
        for i in range(2, end_page + 1):
            if self._stop_flag:
                print('mission has been cancelled')
                break
            c_url = url + str(i)
            if dom := self._crawler.request(url=c_url, referer=refer):
                if self._crawler.error_enough_exit:
                    _logger.warning('too many errors, break out')
                    break
                # 提取元数据
                if data := self._meta.main(dom, c_url):
                    pass
            # 写入数据
            refer = c_url

    def start(self):
        self._send_request(self._recent_post)

    def _key_press(self):
        # 按键退出程序
        while True:
            k = ord(msvcrt.getch())
            # exit, q
            if k == 113 or k == 81:
                self._stop_flag = True
                break

    def _control(self):
        # 额外线程 => 控制
        th = threading.Thread(target=self._key_press)
        th.daemon = True
        th.start()
