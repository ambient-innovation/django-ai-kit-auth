from semantic_parser.history import angular_parser


def django_parser(commit_msg):
    level, change_type, scope, content = angular_parser(commit_msg)

    if "django" not in scope:
        return 0, "chore", scope, content

    return level, change_type, scope, content
