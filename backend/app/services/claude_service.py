import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class ClaudeService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

    async def analyze_cv(self,cv_text: str,job_desc) -> dict:
        try:
            response = self.client.messages.create(
                model = "claude-3-haiku-20240307",
                max_tokens=200,
                messages=[
                    {"role": "user", "content": f"""
                    Analyze resume for job. Return ONLY valid JSON with quotes:

                    Resume: {cv_text}
                    Job: {job_desc}

                    Return exactly this format with quotes around ALL values:
                    {{
                        "score": 80,
                        "skills": {{
                            "skill1": "skill name",
                            "skill2": "skill name", 
                            "skill3": "skill name"
                        }},
                        "summary": "brief summary"
                    }}

                    Rules:
                    - Valid JSON only, no extra text
                    - Score: 1-100 integer for job match
                    - Skills: 3 most relevant skills from resume
                    - Summary: max 80 characters
                    - be very hard in your score evaluation, senior should get higher score for relevant experience
                    """}
                ]
            )
            return {
                "success": True, "analysis": response.content[0].text.strip()
            }
        except Exception as e:
            return {
                "success": False, "error":str(e)
            }

