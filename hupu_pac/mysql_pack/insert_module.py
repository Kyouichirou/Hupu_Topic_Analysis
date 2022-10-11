__all__ = ['Insert']

from . import Database
from ..log_module import Logs

_logger = Logs()


class Insert(Database):
    def __init__(self):
        self._abstract_table = 'hupu_topic_abstract_table'
        self._content_table = 'hupu_topic_content_table'

    def insert_abstract(self, data: list) -> bool:
        cmd = f'insert into {self._abstract_table}'
        return self._cmd_execute(cmd, data)

    def insert_content(self, data: list) -> bool:
        cmd = 'hupu_topic_content_table'
        return self._cmd_execute(cmd, data)

    @_logger.decorator('failed to insert data')
    def _cmd_execute(self, cmd, data: list) -> bool:
        self.cursor.executemany(cmd, data)
        self.is_changed = True
        return True
