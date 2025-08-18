import json
from app.services.claude_service import ClaudeService

claud = ClaudeService()

async def cv_analyzer(cv_text,job_desc):
    response = await claud.analyze_cv(cv_text,job_desc)
    if not response.get("success"):
        return {
            "success": False,
            "error": response.get("error","unknown error")
        }
    try:
        analysis_text = response.get("analysis", "")
        analysis_text = analysis_text.strip()

        if not analysis_text.startswith('{'):
            start = analysis_text.find('{')
            if start != -1:
                analysis_text = analysis_text[start:]

        if not analysis_text.endswith('}'):
            end = analysis_text.rfind('}')
            if end != -1:
                analysis_text = analysis_text[:end + 1]

        parsed_analysis = json.loads(analysis_text)

        return {
            "success": True,
            "score": parsed_analysis.get("score", 0),
            "skills": parsed_analysis.get("skills", {}),
            "summary": parsed_analysis.get("summary", "")
        }


    except json.JSONDecodeError as e:

        return {

            "success": False,

            "error": f"Failed to parse JSON: {str(e)}",

            "raw_response": analysis_text

        }

    except KeyError as e:

        return {

            "success": False,

            "error": f"Missing required field: {str(e)}",

            "raw_response": analysis_text

        }

    except Exception as e:

        return {

            "success": False,

            "error": f"Error processing response: {str(e)}"

        }



