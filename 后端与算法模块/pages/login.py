import streamlit as st
from user_service import login

st.set_page_config(page_title="登录")
st.title("同频共学")

username = st.text_input("用户名")
password = st.text_input("密码", type="password")

if st.button("登录"):
    if username and password:
        result = login(username, password)
        if result["success"]:
            st.session_state["uid"] = result["uid"]
            st.session_state["nick"] = result["nick"]
            st.success("登录成功")
            st.switch_page("pages/home.py")
        else:
            st.error(result["msg"])
    else:
        st.warning("请填写用户名和密码")