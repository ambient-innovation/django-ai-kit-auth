from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status, views
from rest_framework.response import Response


def unauthorized(request):
    return HttpResponse(status=401)


class PostTest(views.APIView):
    """
    Endpoint to test that a custom post request succeeds
    """

    @method_decorator(csrf_protect)
    def post(self, request, *args, **kwargs):
        return Response({"test": "it works"}, status=status.HTTP_200_OK)
