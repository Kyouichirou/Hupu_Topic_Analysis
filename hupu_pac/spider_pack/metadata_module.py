__all__ = ['Meta']

import re
from ..log_module import Logs
from .time_format_module import str_to_timestamp

# @description: html解析
# finished_state: 1

_logger = Logs()


class Meta:
    def __init__(self):
        self._url_id_reg = re.compile('(?<=/)\d+(?=\.html)')
        self._authorid_reg = re.compile('(?<=/)\d+')
        self._num_reg = re.compile('\d+')
        self._data_length_limit = {
            'title': 64,
            'author_id': 20,
            'author_name': 32,
            'content': 1024
        }

    @staticmethod
    def _slice_text(text: str, i_len: int):
        return text if len(text) < i_len else text[0: i_len]

    def _get_content(self, node, name):
        text = node.text
        return self._slice_text(text, self._data_length_limit[name]) if text else ""

    def _get_author_id(self, url):
        return ms.group() if (ms := self._authorid_reg.search(url)) else ''

    def _get_author(self, dom):
        node = dom.find('div', class_='user-base-info')
        if node:
            a_dic = {
                'post_time': None,
                'author_id': '',
                'author_name': '',
                'author_level': 0
            }
            if a := node.find('a'):
                if 'href' in a.attrs:
                    if href := a.attrs['href']:
                        if a_id := self._get_author_id(href):
                            a_dic['author_id'] = a_id
                            if a_text := a.text:
                                a_dic['author_name'] = self._slice_text(a_text, self._data_length_limit['author'])
                                if p_time := node.find('span', class_='post-user-comp-info-top-time'):
                                    if post_time := p_time.text:
                                        a_dic['post_time'] = str_to_timestamp(post_time)
                                        if level := node.find('span', class_='post-user-comp-info-top-level'):
                                            if l_text := level.text:
                                                if ms := self._num_reg.search(l_text):
                                                    a_dic['author_level'] = int(ms.group())
                                                    return a_dic

    @staticmethod
    def _get_pics_quantity(node):
        return len(node.find_all('div', class_='slate-image'))

    @staticmethod
    def _check_video(node) -> int:
        return 1 if node.find('video') else 0

    def _get_url_id(self, url: str):
        return ms.group() if (ms := self._url_id_reg.search(url)) else None

    def get_all_links(self, dom):
        # 读取目录页的URL_id
        node = dom.find('div', class_='bbs-sl-web-post')
        if node:
            links = node.find_all('li', class_='bbs-sl-web-post-body')
            arr = []
            for link in links:
                a = link.find('a')
                if a:
                    if 'href' in a.attrs:
                        href = a.attrs['href']
                        if href:
                            if u_id := self._get_url_id(href):
                                arr.append(u_id)
            return arr

    def _get_title(self, dom):
        return self._get_content(head, 'title') if (head := dom.find('head')) else ''

    def _high_light_content(self, dom):
        # 高亮内容提取
        # bbs-post-wrapper light
        if node := dom.find('div', class_=''):
            light_nodes = node.find_all('div', class_='post-reply-list ')

    def main(self, dom, url: str):
        url_id = self._get_url_id(url)
        if not url_id:
            _logger.warning(f'failed to get url_id from {url}')
            return None
        node = dom.find('div', class_='bbs-thread-comp main-thread')
        if not node:
            _logger.warning(f'failed to get the main node from {url}')
            return None
        content = self._get_content(node, name='content')
        a_dic = self._get_author(dom)
        if not a_dic:
            return None
        # url_id, 标题, 发表时间, 作者id, 作者名称, 作者等级, 是否为视频帖子, 内容, 内容长度, 图片的数量
        info = {
            "url_id": url_id,
            "title": self._get_title(dom),
            'post_time': None,
            'author_id': '',
            'author_name': '',
            'author_level': 0,
            'is_video': self._check_video(node),
            'content': content,
            'content_length': len(content),
            'pics_quantity': self._get_pics_quantity(node)
        }
        # ** 解包dict, 后面的项将覆盖前面dict的项, 如果不存在则, 添加新的项
        return {**info, **a_dic}
