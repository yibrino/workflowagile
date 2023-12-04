import json

import pandas as pd


def convert_excel_to_json(excel_data_io):
    selected_columns = ["Topic", "QuestionText", "Score", "MultipleChoiceOptions", "MultipleChoiceAnswers"]

    try:
        # Explicitly set engine to openpyxl
        df = pd.read_excel(excel_data_io, usecols=selected_columns, engine='openpyxl')
    except Exception as e:
        return {"error": str(e)}

    dict_data = {"question": []}

    for _, row in df.iterrows():
        json_row = {}
        for column_name in selected_columns:
            if column_name == "MultipleChoiceOptions":
                # Convert bytes to string using utf-8
                options = str(row[column_name]).split(';') if pd.notnull(row[column_name]) else []

                # Convert the value to a string and then split
                answers = set(map(int, str(row["MultipleChoiceAnswers"]).split(';'))) if pd.notnull(
                    row["MultipleChoiceAnswers"]) else set()

                answer_options = [{"text": option.strip(), "isCorrect": index + 1 in answers} for index, option in
                                  enumerate(options)]
                json_row["answers"] = answer_options

            elif column_name != "MultipleChoiceAnswers":
                renamed_columns = {
                    "QuestionText": "text",
                    "Score": "score",
                    "Topic": "topic",
                    "MultipleChoiceOptions": "answers",
                }
                json_row[renamed_columns.get(column_name, column_name)] = row[column_name]

        dict_data["question"].append(json_row)
    return json.dumps(dict_data)
