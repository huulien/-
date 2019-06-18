# 6-5-reclab

### 开发日志

6/9 subject详细页(80%)
- intro card 采用 collapse, 用 ajax 读数据.
- 404组件, 5秒倒计时回首页.
- 指定 router-view keep-alive

6/10
- 修改数据库, score, rating改为 Number(坑我好久..$gte死活查不出)
- 做主页 search bar.
- 添加 fontawesome
- 添加一个 restful api all
- 做 search 结果页.
- 加入@media query scss(但不是很懂), 有空再学.
- test infinite-scroll okay.

6/11
- 使用vue-infinite-scroll, 将 search页修改. 并添加一个 scroll to top.
- 复习概率论准备考试.

6/12
- 学习制作用户系统.
- 休息&考试一天.

6/13 **代码结构重构**
- 将 admin 路由分离出去.
- 将 Fetch 改为 axios.
- 加入 vuex
- <del>search, subject, 改为使用 vuex管理资料.</del>

6/14 
- 设计一个更合理的 api 省流量.
- 决定只使用 vuex 管理用户状态.
- 添加 router for signup.

6/15
- 添加用户 (注册并登录页面)
- sessions 保存用户状态
- 前后端通信全靠 ajax (我这样对吗?)

6/16
- 借书 & 评论 功能.
- <del>个人详情页.(未完成)</del>

6/17
- 用户 signout
- 完成个人详情页功能

6/18
- 美化一下个人详情页, 用户UI便收工
- 不如再来几个酷炫的 css animation
- <mark>评论板确实让人没有留言的欲望</mark>
- 收工


### 坑

1. 仅指定特定的 router-view keep-alive 的话, 是用模块名而不是 router name.