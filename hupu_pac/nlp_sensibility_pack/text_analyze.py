from LAC import LAC


# @description: 文本处理, 分词采用百度的LAC

class TextAnalyze:
    def __init__(self, normal=True):
        user_dict_path = ''
        stop_words_path = ''
        self._lac = LAC(mode=('seg' if normal else 'lac'))
        # 载入自定义字典
        self._lac.load_customization(user_dict_path)
        # 载入停用词
        with open(stop_words_path, encoding='utf-8', mode='r') as f:
            self._stop_words = [line.rstrip('\n') for line in f.readlines()]

    def normal_segment(self):
        # 常规分词
        pass

    def lac_segment(self):
        # 将获得词组和词性
        pass
