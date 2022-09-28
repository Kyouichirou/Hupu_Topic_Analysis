__all__ = ['Logs']

import os
import time
from loguru import logger


# @author: HLA
# @update: 2022-09-27
# @finished_state: 1
# @description: 日志记录, 更为友好的日志记录-loguru
# @name: 日志记录

class Logs:
    _instance = None
    _duplicated_dic = None
    # 是否启用过滤模式
    filter_mode = False

    @staticmethod
    def _time_stamp(is_thirteen=False):
        return str(int(time.time() * 1000 if is_thirteen else time.time()))

    def __new__(cls, **kwargs):
        if not cls._instance:
            # 用于存储消息, 剔除掉重复显示的数据
            cls._duplicated_dic = {
                'info': [],
                'debug': [],
                'error': [],
                'warning': []
            }
            path = os.path.dirname(__file__) + fr'\log_{cls._time_stamp(True)}.log'
            if not kwargs:
                kwargs = {
                    'sink': path,
                    'rotation': "5MB",
                    'encoding': "utf-8",
                    'enqueue': True,
                    'backtrace': True,
                    'diagnose': True
                }
            cls._instance = super(Logs, cls).__new__(cls)
            logger.add(**kwargs)
        return cls._instance

    @classmethod
    def info(cls, msg):
        if cls._check_data('info', msg):
            return
        logger.info(msg)

    @classmethod
    def _check_data(cls, s_type, msg):
        if cls.filter_mode:
            if msg in cls._duplicated_dic[s_type]:
                return True
            cls._duplicated_dic[s_type].append(msg)
        return False

    @classmethod
    def debug(cls, msg):
        if cls._check_data('debug', msg):
            return
        logger.debug(msg)

    @classmethod
    def warning(cls, msg):
        if cls._check_data('warning', msg):
            return
        logger.warning(msg)

    @classmethod
    def error(cls, msg):
        if cls._check_data('error', msg):
            return
        logger.error(msg)

    @staticmethod
    def capture_except(msg):
        logger.exception(msg)

    @classmethod
    def __setattr__(cls, key, value):
        if key == '_filter_mode':
            cls.filter_mode = value

    def decorator(self, msg):
        def decorator_log(func):
            # 错误日志记录-装饰器
            def wrapper(*args, **kwargs):
                # noinspection PyBroadException
                try:
                    return func(*args, **kwargs)
                except Exception:
                    self.capture_except(msg)
                    return None

            return wrapper

        return decorator_log


if __name__ == '__main__':
    _logger = Logs()
    # noinspection PyBroadException
    try:
        print(1 / 0)
    except Exception:
        _logger.capture_except('test')
