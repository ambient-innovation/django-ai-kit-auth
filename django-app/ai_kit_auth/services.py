from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from .settings import api_settings

User = get_user_model()


def scramble_id(seq_id):
    """
    This is called a feistel chipher.
    It creates a pseudo random, but unique identifier from a number.
    It can be used instead of sequential primary keys in api functions
    to prevent exposing backend details.
    It is its own inverse, so converting back is done by calling it again.

    In case of an id other than an unsigned integer in the 32 bit range we
    assume its a uuid or similar and we return it as is.

    further reading: https://wiki.postgresql.org/wiki/Pseudo_encrypt
    """

    try:
        val = int(seq_id) & 0xFFFFFFFF  # restrict to u32
    except ValueError:
        # not an int, return as is
        return seq_id

    if val != int(seq_id):
        # not in the range of 0 .. 2^32, also return as is
        return seq_id

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


def custom_email_data():
    """
    function that can be set via settings var to add additional variables to the template
    """
    return {}


def send_email(subject, text, html, to_address):
    from_address = settings.DEFAULT_FROM_EMAIL
    msg = EmailMultiAlternatives(subject, text, from_address, [to_address])
    msg.attach_alternative(html, "text/html")
    msg.send()


def make_url(*args):
    return "/".join(str(s).strip("/") for s in args)


def get_activation_url(user):
    ident = str(scramble_id(user.pk))
    token_gen = PasswordResetTokenGenerator()
    token = token_gen.make_token(user)

    return make_url(
        api_settings.FRONTEND.URL, api_settings.FRONTEND.ACTIVATION_ROUTE, ident, token
    )


def send_user_activation_mail(user):
    sender_func = api_settings.SEND_USER_ACTIVATION_MAIL
    sender_func(user, get_activation_url(user))


def default_send_user_activation_mail(user, url):
    """
    Sends the initial mail for a nonactive user.
    """
    template_plain = get_template(
        api_settings.EMAIL_TEMPLATES.USER_CREATED.BODY_PLAINTEXT
    )
    template_html = get_template(api_settings.EMAIL_TEMPLATES.USER_CREATED.BODY_HTML)
    subject = get_template(api_settings.EMAIL_TEMPLATES.USER_CREATED.TITLE).render()

    context = {
        "user": user,
        "url": url,
    }

    # Add custom variables
    custom_function = api_settings.EMAIL_TEMPLATES.CUSTOM_DATA_FUNCTION
    context.update(custom_function())

    send_email(
        subject.replace("\n", " "),
        template_plain.render(context),
        template_html.render(context),
        getattr(user, User.get_email_field_name()),
    )


def send_activation_by_admin_mail(user):
    sender_func = api_settings.SEND_ACTIVATION_BY_ADMIN_MAIL
    sender_func(user, get_activation_url(user))


def default_send_activation_by_admin_mail(user, url):
    """
    send mail for the password reset
    """
    template_plain = get_template(
        api_settings.EMAIL_TEMPLATES.SET_PASSWORD.BODY_PLAINTEXT
    )
    template_html = get_template(api_settings.EMAIL_TEMPLATES.SET_PASSWORD.BODY_HTML)
    subject = get_template(api_settings.EMAIL_TEMPLATES.SET_PASSWORD.TITLE).render()

    context = {
        "user": user,
        "url": url,
    }

    # Add custom variables
    custom_function = api_settings.EMAIL_TEMPLATES.CUSTOM_DATA_FUNCTION
    context.update(custom_function())

    send_email(
        subject.replace("\n", " "),
        template_plain.render(context),
        template_html.render(context),
        getattr(user, User.get_email_field_name()),
    )


def get_password_reset_url(user):
    ident = str(scramble_id(user.pk))
    token_gen = PasswordResetTokenGenerator()
    token = token_gen.make_token(user)

    return make_url(
        api_settings.FRONTEND.URL, api_settings.FRONTEND.RESET_PW_ROUTE, ident, token
    )


def send_reset_pw_mail(user):
    sender_func = api_settings.SEND_RESET_PW_MAIL
    sender_func(user, get_password_reset_url(user))


def default_send_reset_pw_mail(user, url):
    """
    send mail for the password reset
    """
    template_plain = get_template(
        api_settings.EMAIL_TEMPLATES.RESET_PASSWORD.BODY_PLAINTEXT
    )
    template_html = get_template(api_settings.EMAIL_TEMPLATES.RESET_PASSWORD.BODY_HTML)
    subject = get_template(api_settings.EMAIL_TEMPLATES.RESET_PASSWORD.TITLE).render()

    context = {
        "user": user,
        "url": url,
    }

    # Add custom variables
    custom_function = api_settings.EMAIL_TEMPLATES.CUSTOM_DATA_FUNCTION
    context.update(custom_function())

    send_email(
        subject.replace("\n", " "),
        template_plain.render(context),
        template_html.render(context),
        getattr(user, User.get_email_field_name()),
    )
