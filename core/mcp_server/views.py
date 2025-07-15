from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class IntelligentSearchAPIView(APIView):
    def post(self, request, *args, **kwargs):
        query = request.data.get('query', '')
        if not query:
            return Response({"error": "Query cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Replace this with your actual MCP server logic
        response_data = self.get_mcp_response(query)

        return Response(response_data, status=status.HTTP_200_OK)

    def get_mcp_response(self, query):
        # Mock response for demonstration
        lower_case_query = query.lower()
        if 'enroll' in lower_case_query:
            return {"answer": "You can enroll by visiting our website and filling out the enrollment form."}
        elif 'fees' in lower_case_query:
            return {"answer": "Our fees are $100 per week. We also offer discounts for siblings."}
        elif 'timings' in lower_case_query:
            return {"answer": "We are open from 8 AM to 6 PM, Monday to Friday."}
        else:
            return {"answer": "I'm sorry, I don't have an answer for that. Please contact us for more information."}