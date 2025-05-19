from flask import Flask, jsonify, request, send_file ,send_from_directory
from flask_cors import CORS
from flasgger import Swagger, swag_from
from utils.file_handler import create_doc, process_resume_file
from utils.file_upload_down import download_and_process_resume_from_url, upload_file_to_cloudinary
from utils.match_score import calculate_match_score
from utils.nlp_processor import (
    analyze_resume_format,
    analyze_resume_gemini,
    analyze_resume_with_gemini,
    calculate_match_score_gemini,
    extract_skills_with_gemini,
    generate_ats_friendly_resume,
    generate_response_from_llama_gemini,
)
import cloudinary
import cloudinary.uploader
from utils.vector_store import ResumeVectorDB
import os

app = Flask(__name__)
CORS(app)

vector_db = ResumeVectorDB()

# UPLOAD_FOLDER = "uploads"
# if not os.path.exists(UPLOAD_FOLDER):
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

swagger = Swagger(app)


@app.route("/greet", methods=["get"])
@swag_from("swag/greet.yml") 
def greet_user():
    name = request.args.get("name")

    if name:
        return jsonify({"message": f"Hi, Good morning {name}!"})
    else:
        return jsonify({"error": "Name parameter is missing"}), 400


@app.route("/upload_check_file", methods=["POST"])
@swag_from("swag/upload_check_file.yml") 
def upload_check_file():
    """Upload Resume"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    
    try:
        result = upload_file_to_cloudinary(file)
        print(result)
        file_url = result.get("secure_url")
        
        return jsonify({"message": "File uploaded", "url": file_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/upload_resume", methods=["POST"])
@swag_from("swag/upload_resume.yml")
def upload_resume():
    """Upload and analyze a resume"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    upload_result,ext = upload_file_to_cloudinary(file)
    
    if not upload_result or "secure_url" not in upload_result:
        return jsonify({"error": "Failed to upload to Cloudinary"}), 500
    cloud_url = upload_result["secure_url"]

    layout = "false"
    extracted_text, links , filename = download_and_process_resume_from_url(cloud_url,layout,ext)
    # extracted_text, links, filename = process_resume_file(
    #     file, app.config["UPLOAD_FOLDER"]
    # )

    if extracted_text is None:
        return jsonify({"error": "Unsupported file format"}), 400

    analysis = analyze_resume_gemini(extracted_text, links)

    vector_db.add_resume(extracted_text)

    return jsonify(
        {
            "filename": filename,
            "links": links,
            "extracted_text": extracted_text,
            "data": analysis,
        }
    )


@app.route("/upload_resume_jd", methods=["POST"])
@swag_from("swag/upload_resume_jd.yml")  
def upload_resume_jd():
    """Upload and analyze a resume"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    job_description = request.form.get("job_description")
    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    upload_result,ext = upload_file_to_cloudinary(file)
    if not upload_result or "secure_url" not in upload_result:
        return jsonify({"error": "Failed to upload to Cloudinary"}), 500
    cloud_url = upload_result["secure_url"]
    
    layout = "false"
    extracted_text, _ , _ = download_and_process_resume_from_url(cloud_url,layout,ext)
    # process_resume_file(
    #     file, app.config["UPLOAD_FOLDER"]
    # )

    if extracted_text is None:
        return jsonify({"error": "Unsupported file format"}), 400

    vector_db.add_resume(extracted_text)

    match_data = analyze_resume_with_gemini(extracted_text, job_description)

    return jsonify(
        {
            "match": match_data,
        }
    )


@app.route("/query", methods=["POST"])
@swag_from("swag/qalangchain.yml")
def query_resume():
    """Answers user queries based on stored resumes."""
    data = request.json
    query = data.get("query")
    print("Printing query")
    print(query)
    if not query:
        return jsonify({"error": "Query is required"}), 400

    similar_resumes = vector_db.search_resumes(query)
    context = "\n\n".join(similar_resumes)
    print(context)

    gemini_prompt = f"""
    Answer the user's query based on the following stored resumes:
    {context}

    Question: {query}
    """

    response = generate_response_from_llama_gemini(gemini_prompt)

    return jsonify({"response": response}), 200


@swag_from("swag/upload_resume_ats.yml")
@app.route("/upload_resume_ats", methods=["POST"])
def upload_resume_ats():
    """API to check resume ATS compliance and formatting."""
    if "resume" not in request.files:
        return jsonify({"error": "Resume file is required"}), 400

    resume_file = request.files["resume"]
    layout = request.form.get("layout")
    if not layout:
        layout = "false"
    layout = layout.lower()
    
    upload_result,ext = upload_file_to_cloudinary(resume_file)
    if not upload_result or "secure_url" not in upload_result:
        return jsonify({"error": "Failed to upload to Cloudinary"}), 500
    cloud_url = upload_result["secure_url"]
    
    resume_text, links, _ = download_and_process_resume_from_url(cloud_url,layout,ext)
    # resume_text, links, _ = process_resume_file(
    #     resume_file, app.config["UPLOAD_FOLDER"], layout
    # )

    if not resume_text:
        return jsonify({"error": "Could not extract text from resume"}), 400

    result = analyze_resume_format(resume_text, links)
    print("result",result)
    return jsonify(result)


@swag_from("swag/optimize_resume.yml")
@app.route("/optimize_resume", methods=["POST"])
def optimize_resume():
    """API to check and optimize ATS compliance."""
    if "resume" not in request.files:
        return jsonify({"error": "Resume file is required"}), 400

    resume_file = request.files["resume"]
    layout = "true"
    upload_result,ext = upload_file_to_cloudinary(resume_file)
    if not upload_result or "secure_url" not in upload_result:
        return jsonify({"error": "Failed to upload to Cloudinary"}), 500
    cloud_url = upload_result["secure_url"]
    resume_text, links, filename = download_and_process_resume_from_url(cloud_url,layout,ext)
    # resume_text, links, filename = process_resume_file(
    #     resume_file, app.config["UPLOAD_FOLDER"], layout
    # )

    if not resume_text:
        return jsonify({"error": "Could not extract text from resume"}), 400

    ats_friendly_resume, explanation = generate_ats_friendly_resume(resume_text, links)

    optimized_resume_path = create_doc(ats_friendly_resume, filename)
    return jsonify({"download_url": optimized_resume_path, "explanation": explanation})

@app.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory('uploads', filename, as_attachment=True)

if __name__ == "__main__":
    # app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)