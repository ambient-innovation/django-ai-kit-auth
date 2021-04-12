from semantic_release.history.parser_angular import parse_commit_message
from semantic_release.history.parser_helpers import ParsedCommit


def django_parser(commit_msg):
    parsed = parse_commit_message(commit_msg)

    if not parsed.scope or "django" not in parsed.scope:
        return ParsedCommit(0, "chore", *parsed[2:])

    return parsed
