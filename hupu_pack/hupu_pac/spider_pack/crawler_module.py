__all__ = ['Crawler']

import requests
from bs4 import BeautifulSoup as Dom_convertor
from hupu_pac.log_module import Logs
from hupu_pac.random_browser_header_pack import Header

_logger = Logs()


class Crawler:
    def __init__(self):
        # 累计请求总数
        self._total_request_times = 0
        # 请求总次数
        self._request_counter = 0
        # 请求失败次数
        self._fail_request_times = 0
        # 请求成功次数
        self._success_request_times = 0
        # 错误记录
        self._error_records = None
        # 手动控制退出
        self._is_stop = False
        # 退出信号
        self._exit_signal = False
        # 请求session
        self._session = None
        # 请求头
        self._headers = None
        # 伪装请求头
        self._header = Header()

    @property
    def error_enough_exit(self) -> bool:
        return self._exit_signal

    @property
    def total_request_times(self):
        self._total_request_times += self._request_counter
        return self._total_request_times

    @total_request_times.setter
    def total_request_times(self, times):
        self._total_request_times = times

    def initial(self):
        self._error_records = {
            '404': 0,
            '301': 0,
            '302': 0,
            'other': 0
        }
        self._exit_signal = False
        self._is_stop = False
        self._fail_request_times = 0
        self._success_request_times = 0
        self._session = requests.session()

    def _change_headers(self, is_same_site=False):
        self._headers = self._header.get_random_header(is_same_site)

    @staticmethod
    def _handle_200(result):
        return Dom_convertor(result)

    def _handle_404(self, result):
        self._error_records['404'] += 1

    def _handle_302(self, result):
        self._error_records['302'] += 1

    def _handle_301(self, result):
        self._error_records['301'] += 1

    def _handle_other(self, result):
        self._error_records['other'] += 1

    def request(self, url='', referer=''):
        try:
            if self._is_stop:
                return None
            self._request_counter += 1
            print(f'spider: {url}, request_times: {self._request_counter}')
            if referer:
                self._headers['Referer'] = referer
            result = self._session.get(url, headers=self._headers, timeout=(63, 63))
            code = result.status_code
            func = getattr(self, f'_handle_{code}', None) or self._handle_other
            if data := func(result):
                self._success_request_times += 1
                return data
            else:
                self._fail_request_times += 1
        except Exception as error:
            _logger.capture_except(str(error))
