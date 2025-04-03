package com.rentmatch.app.service;

import com.rentmatch.app.dao.QuestionDAO;
import com.rentmatch.app.entity.Question;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {
    private QuestionDAO questionDAO;

    public QuestionServiceImpl(QuestionDAO questionDAO) {
        this.questionDAO = questionDAO;
    }
/*
    @Override
    public Question findQuestion(String username, int questionNumber) {
        return questionDAO.findQuestion(username, questionNumber);
    }

    @Transactional
    @Override
    public void saveQuestion(Question question) {
        questionDAO.saveQuestion(question);
    }
    */

    @Override
    public List<Question> findAll(String username) {
        return questionDAO.findAllQuestions(username);
    }
}
