import re
from setuptools import setup

with open("ai_kit_auth/__init__.py", "r") as fd:
    version = re.search(
        r'^__version__\s*=\s*[\'"]([^\'"]*)[\'"]', fd.read(), re.MULTILINE
    ).group(1)

setup(
    version=version,
    install_requires=["Django>=3.0.0"],
    tests_require=[],
    test_suite="runtests.runtests",
)
