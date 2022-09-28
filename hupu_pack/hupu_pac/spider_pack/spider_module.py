__all__ = ['Spider']

import msvcrt
import threading
from .metadata_module import Meta
from .crawler_module import Crawler


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

    def _send_request(self, target: dict):
        url, end_page = target.values()
        refer = ''
        for i in range(2, end_page + 1):
            if self._stop_flag:
                print('mission has been cancelled')
                break
            c_url = url + str(i)
            if data := self._crawler.request(url=c_url, referer=refer):
                if self._crawler.error_enough_exit:
                    print('too many errors, break out')
                    break
                pass
            refer = c_url

    def start(self):
        pass

    def _key_press(self):
        while True:
            k = ord(msvcrt.getch())
            if k == 113 or k == 81:
                self._stop_flag = True
                break

    def _control(self):
        th = threading.Thread(target=self._key_press)
        th.daemon = True
        th.start()
