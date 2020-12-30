from django.dispatch import Signal, receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

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


@receiver(post_save, sender=get_user_model())
def invalidate_tokens_on_user_deactivation(sender, instance, **kwargs):
    if not instance.is_active:
        post_save.disconnect(
            invalidate_tokens_on_user_deactivation, sender=get_user_model()
        )
        # this will automatically invalidate all tokens
        instance.set_unusable_password()
        instance.save()
        post_save.connect(
            invalidate_tokens_on_user_deactivation, sender=get_user_model()
        )
