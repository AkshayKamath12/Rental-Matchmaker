package com.rentmatch.app.dao;

import com.rentmatch.app.entity.Question;

import java.util.List;

public interface QuestionDAO {
    Question findQuestion(String username, int questionNumber);

    void saveQuestion(Question question);

    List<Question> findAllQuestions(String username);

}
