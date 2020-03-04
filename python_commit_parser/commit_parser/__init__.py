from semantic_release.history.parser_angular import parse_commit_message
from unittest.mock import patch


def get_owner_and_name():
    return "ai/ai.kit", "authentication"


# semantic_release does not recognize owner names with dots in them,
# so we need to patch the function which obtains it until it is fixed
# in python-semantic-release
patch("semantic_release.cli.get_repository_owner_and_name", get_owner_and_name).start()


def django_parser(commit_msg):
    level, change_type, scope, content = parse_commit_message(commit_msg)

    if "django" not in scope:
        return 0, "chore", scope, content

    return level, change_type, scope, content
