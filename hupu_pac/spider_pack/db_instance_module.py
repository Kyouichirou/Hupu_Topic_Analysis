from ..mysql_pack import Database
from ..mysql_pack.check_module import Check
from ..mysql_pack.insert_module import Insert


class Instance:
    @property
    def initial_flag(self) -> bool:
        return self._initial_flag

    def __init__(self):
        configs = {
            "user": "root",
            "host": "localhost",
            "passwd": "MySQL2022",
            "port": 3306,
            "database": "hupu_database"
        }
        self._initial_flag = False
        self._database = Database(configs)
        if self._database.initial():
            self._check = Check()
            self._insert = Insert()
            self._initial_flag = True

    def insert_abstract(self, data) -> bool:
        return self._insert.insert_abstract(data)

    def insert_content(self, data) -> bool:
        return self._insert.insert_content(data)

    def check_url_id(self, url_id: str):
        return self._check.check_url_id(url_id)
