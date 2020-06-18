from django.dispatch import Signal

user_pre_login = Signal(providing_args=["user"])
user_post_login = Signal(providing_args=["user"])
user_pre_logout = Signal(providing_args=["user"])
user_post_logout = Signal(providing_args=["user"])
user_pre_registered = Signal(providing_args=["user_data"])
user_post_registered = Signal(providing_args=["user"])
user_pre_activated = Signal(providing_args=["user"])
user_post_activated = Signal(providing_args=["user"])
user_pre_forgot_password = Signal(providing_args=["user"])
user_post_forgot_password = Signal(providing_args=["user"])
user_pre_reset_password = Signal(providing_args=["user"])
user_post_reset_password = Signal(providing_args=["user"])
