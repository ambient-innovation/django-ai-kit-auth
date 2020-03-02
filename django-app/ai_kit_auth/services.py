from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail


def feistel_chipher(seq_id):
    """
    Creates a pseudo random, but unique identifier from a number.
    It can be used instead of sequential primary keys in api functions
    to prevent exposing backend details.
    It is its own inverse, so converting back is done by calling it again.

    further reading: https://wiki.postgresql.org/wiki/Pseudo_encrypt
    """
    val = int(seq_id) & 0xFFFFFFFF  # restrict to u32

    if val != int(seq_id):  # Shouldn't come up in praxis
        raise ValueError(
            f"Input out of Range, id is {seq_id}, but must be in [0 .. 2^32)"
        )

    l1 = (val >> 16) & 0xFFFF
    r1 = val & 0xFFFF
    for _ in range(0, 3):
        l2 = r1
        r2 = (
            l1
            ^ int(round((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767))
            & 0xFFFFFFFF
        )
        l1 = l2
        r1 = r2
    return ((r1 & 0xFFFF) << 16) + l1


def send_user_activation_mail(user):
    """
    Sends the initial mail for a nonactive user.
    """
    ident = str(feistel_chipher(user.id))
    token_gen = PasswordResetTokenGenerator()
    token = token_gen.make_token(user)
    send_mail("Activation", f"{ident}/{token}", "from@example.com", [user.email])
    return (ident, token)


def send_user_password_reset_mail(sender, instance, created, **kwargs):
    """
    Sends the initial mail for an deactivated user.
    """
    from django.contrib.auth.forms import PasswordResetForm

    form = PasswordResetForm({"email": instance.email})
    form.is_valid()
    form.save(
        domain_override=settings.FRONTEND_PASSWORD_RESET_URL,
        subject_template_name="new_user_mail/title.txt",
        email_template_name="new_user_mail/body.txt",
        from_email=settings.DEFAULT_FROM_EMAIL,
        extra_email_context={"name": instance.display_name},
    )
