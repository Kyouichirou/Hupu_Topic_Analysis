__all__ = ['Check']

from . import Database
from ..log_module import Logs

_logger = Logs()


class Check(Database):
    def __init__(self):
        self._abstract_table = 'hupu_topic_abstract_table'

    def _cmd_execute(self, cmd, data):
        # noinspection PyBroadException
        # 为防止后续出现重复的键值, 出现错误则统一返回True
        try:
            self.cursor.execute(cmd, data) if data else self.cursor.execute(cmd)
            r = self.cursor.fetchall()
            self.sql.free_result()
            return True if r else False
        except Exception:
            _logger.capture_except(f'fail to check url_id: {cmd}')
            return True

    def check_url_id(self, url_id: int) -> bool:
        cmd = f'select 1 from {self._abstract_table} where url_id={url_id} limit 1;'
        return self._cmd_execute(cmd, None)
