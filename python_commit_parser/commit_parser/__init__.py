from semantic_release.history.parser_angular import parse_commit_message


def django_parser(commit_msg):
    level, change_type, scope, *args = parse_commit_message(commit_msg)

    if not scope or "django" not in scope:
        return (0, "chore", scope, *args)

    return (level, change_type, scope, *args)
