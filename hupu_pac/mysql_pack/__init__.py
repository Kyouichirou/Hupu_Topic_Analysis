__all__ = ['Database']

from ..log_module import Logs
import mysql.connector as connector

_logger = Logs()


# @description: mysql连接数据库

class Database:
    _instance = None
    sql = None
    cursor = None
    is_changed = False

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    @classmethod
    @_logger.decorator('创建数据库错误')
    def create_db(cls, db_name: str) -> bool:
        cmd = f'CREATE DATABASE IF NOT EXISTS {db_name};'
        cls.cursor.execute(cmd)
        return True

    @classmethod
    @_logger.decorator('创建表错误')
    def create_table(cls, cmd) -> bool:
        cls.cursor.execute(cmd)
        return True

    @classmethod
    @_logger.decorator('查询数据错误')
    def _check(cls, cmd: str):
        cls.cursor.execute(cmd)
        # 存在结果返回的, 需要释放游标
        r = cls.cursor.fetchall()
        cls.sql.free_result()
        return True if r else False

    @classmethod
    def check_db_exist(cls, db_name: str) -> bool:
        # 检查数据库是否存在
        cmd = f'select 1 from information_schema.schemata where schema_name="{db_name}";'
        return cls._check(cmd)

    @classmethod
    def check_table_exist(cls, db_name: str, tb_name: str) -> bool:
        # 检查表是否存在
        cmd = f'select 1 from information_schema.tables where ' \
              f'table_schema="{db_name}" and table_name ="{tb_name}";'
        return cls._check(cmd)

    @classmethod
    def check_field_exist(cls, db_name: str, tb_name: str, field_name: str):
        # 检查字段是否存在
        cmd = f'select 1 from information_schema.columns where ' \
              f'table_schema="{db_name}" and table_name="{tb_name}" ' \
              f'and column_name ="{field_name}";'
        return cls._check(cmd)

    @classmethod
    @_logger.decorator('连接数据库错误')
    def initial(cls, configs: dict) -> bool:
        cls.sql = connector.connect(**configs)
        cls.cursor = cls.sql.cursor()
        return True

    @classmethod
    @_logger.decorator('数据库commit错误')
    def commit(cls):
        # 在connector下, mysql的增删改的操作是在事务中进行的, 需要手动commit
        if cls.is_changed and cls.cursor:
            cls.sql.commit()
            cls.is_changed = False

    @classmethod
    @_logger.decorator('数据库退出错误')
    def quit(cls):
        if cls.cursor:
            cls.commit()
            cls.cursor.close()
        if cls.sql:
            cls.sql.cmd_quit()
        cls.cursor = None
        cls.sql = None
