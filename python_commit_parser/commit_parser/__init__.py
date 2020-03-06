from semantic_release.history.parser_angular import parse_commit_message

def django_parser(commit_msg):
    level, change_type, scope, content = parse_commit_message(commit_msg)

    if "django" not in scope:
        return 0, "chore", scope, content

    return level, change_type, scope, content
