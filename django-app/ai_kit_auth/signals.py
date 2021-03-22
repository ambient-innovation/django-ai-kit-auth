from django.dispatch import Signal, receiver
from django.db.models.signals import pre_save
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

User = get_user_model()


@receiver(pre_save, sender=User)
def invalidate_tokens_on_user_deactivation(sender, instance, **kwargs):
    if instance.id is None or not User.objects.filter(id=instance.id).exists():
        return

    was_active = User.objects.get(id=instance.id).is_active

    if was_active and not instance.is_active:
        # this will automatically invalidate all tokens
        instance.set_unusable_password()
