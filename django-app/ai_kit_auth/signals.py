from django.dispatch import Signal

user_pre_login = Signal()  # args: "user"
user_post_login = Signal()  # args: "user"
user_pre_logout = Signal()  # args: "user"
user_post_logout = Signal()  # args: "user"
user_pre_registered = Signal()  # args: "user_data"
user_post_registered = Signal()  # args: "user"
user_pre_activated = Signal()  # args: "user"
user_post_activated = Signal()  # args: "user"
user_pre_forgot_password = Signal()  # args: "user"
user_post_forgot_password = Signal()  # args: "user"
user_pre_reset_password = Signal()  # args: "user"
user_post_reset_password = Signal()  # args: "user"
