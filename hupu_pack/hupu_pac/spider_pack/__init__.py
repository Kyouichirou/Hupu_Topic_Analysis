__all__ = ['HupuTopicSpider']

from datetime import datetime
from .spider_module import Spider
from apscheduler.schedulers.blocking import BlockingScheduler


# @description: 爬虫, 指定的时间自动爬取数据


class HupuTopicSpider:
    def __init__(self, interval_time: int):
        self._run_times = 0
        self._spider = Spider()
        self._scheduler = BlockingScheduler(timezone='Asia/Shanghai')
        # 不支持限定运行次数, 就算加上时间的限制start_date, end_date, 这样只会停止执行, 但是程序不会退出.
        self._scheduler.add_job(
            func=self._start,
            trigger='interval',
            seconds=interval_time,
            next_run_time=datetime.now(),
        )

    def _start(self):
        self._spider.start()
        self._run_times += 1
        if self._run_times > 10:
            print(f'mission has reached the limitation of {self._run_times}.')
            self.stop()

    def stop(self):
        self._scheduler.shutdown(wait=False)
