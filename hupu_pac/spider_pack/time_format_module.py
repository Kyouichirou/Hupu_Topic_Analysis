__all__ = ['str_to_timestamp']

# description: 日期格式化

from datetime import datetime

_date_reg = '%Y-%m-%d %H:%M:%S'


def str_to_timestamp(s_time: str):
    return datetime.strptime(s_time, _date_reg)
