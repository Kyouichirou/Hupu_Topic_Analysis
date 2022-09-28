# mysql数据连接

```mysql
-- 帖子摘要
create table hupu_topic_abstract_table(
	url_id int UNSIGNED not null PRIMARY key comment '帖子链接id',
	title varchar(64) not null comment '帖子标题',
	post_time TIMESTAMP not null comment '发帖时间',
	author_id char(20) not null comment '作者id',
	author_name char(32) not null comment '作者名称',
	author_level SMALLINT UNSIGNED not null comment '作者等级',
	video_quantity TINYINT UNSIGNED not null comment '视频数量',
	pic_quantity TINYINT UNSIGNED comment '图片数量'
);
-- 帖子内容
create table hupu_topic_content_table(
	url_id int UNSIGNED not null PRIMARY key comment '帖子链接id',
	conetnt VARCHAR(1024) comment '帖子内容文本',
	content_length SMALLINT UNSIGNED not NULL comment '帖子内容长度'
);
```