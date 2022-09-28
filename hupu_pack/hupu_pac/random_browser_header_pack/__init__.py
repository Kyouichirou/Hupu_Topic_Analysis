__all__ = ['Header']

import os
import execjs
import random
from hupu_pac.log_module import Logs

_logger = Logs()


class Header:
    def __init__(self):
        self._initial_flag = False
        self._js_engine = None
        self._language_weight = lambda: str(round(random.uniform(0.1, 1), 1))
        self._sec_ch_ua_extend = {
            # 浏览器ua
            'sec-ch-ua': '"Microsoft Edge";v = "105", " Not;A Brand";v = "99", "Chromium";v = "105"',
            # 是否为移动端
            'sec-ch-ua-mobile': '?0',
            # 设备架构
            'sec-ch-ua-arch': "x86",
            # 系统位数
            'sec-ch-ua-bitness': "64",
            # 浏览器版本
            'sec-ch-ua-full-version': "105.0.1343.50",
            'sec-ch-ua-full-version-list': '"Microsoft Edge";v="105.0.1343.50", '
                                           '" Not;A Brand";v="99.0.0.0", "Chromium";v="105.0.5195.127"',
            # 操作系统
            'sec-ch-ua-platform': "Windows",
            # 系统版本win10
            'sec-ch-ua-platform-version': "10.0.0",
        }
        # 以下四个项是基础项目
        self._sec_ch_ua_base = {
            # 请求的数据内容
            'Sec-Fetch-Dest': 'document',
            # 请求模式
            # 取值cors, 跨域; no-cors, 限制请求; same-origin: 同源; navigate: 页面发生切换的请求; websocket, web发起的
            'Sec-Fetch-Mode': 'navigate',
            # 发起请求-目标的关系
            # 取值: none, 直接访问(书签, 地址栏); cross-site: 跨域请求; same-origin: 发起和目标同源; same-site: https => http, false;
            # https abc.com => sub.abc.com, 一级向二级, TRUE, 同级/低级向高级, false;
            # 第一次请求, none, 后续请求: same-origin
            'Sec-Fetch-Site': 'none',
            # 用户发起请求的方式, 取值0, 标识非用户激活, 1, 用户激活
            'Sec-Fetch-User': '?1'
        }
        self._languages = (
            'zh-CN,zh;q=',
            'en;q=',
            'en-GB;q=',
            'en-US;q=',
            'zh-HK,zh-CN;q=',
            'zh-TW;q='
        )
        self._normal_header = {
            "User-Agent": "",
            'Accept-Language': '',
            "Accept-Encoding": "gzip, deflate, br",
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            "Accept": "text/html,application/xhtml+xml,application/xml;"
                      "q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
        self._initial_js_engine()

    @property
    def js_initial_status(self) -> bool:
        return self._initial_flag

    def get_random_header(self, is_same_site=False):
        self._sec_ch_ua_base['Sec-Fetch-Site'] = 'same-origin' if is_same_site else 'none'
        self._normal_header['User-Agent'] = self._random_ua
        self._normal_header['Accept-Language'] = self._random_language
        c_header = {
            **self._normal_header,
            **self._sec_ch_ua_base
        }
        return c_header

    @property
    def _random_language(self):
        i = random.randint(0, len(self._languages))
        samples = random.sample(self._languages, i)
        languages = (e + self._language_weight() for e in samples)
        return ','.join(languages)

    @property
    def _random_ua(self):
        return self._js_engine.call('get_random_ua')

    @_logger.decorator('js引擎初始化')
    def _initial_js_engine(self):
        js_file = os.path.join(os.path.dirname(__file__), 'random_ua.js')
        if os.path.exists(js_file):
            with open(js_file, mode='r', encoding='utf-8') as f:
                js = f.read()
            self._js_engine = execjs.compile(js)
            self._initial_flag = True
