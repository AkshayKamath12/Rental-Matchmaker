package com.rentmatch.app.service;

import com.rentmatch.app.entity.Question;
import org.springframework.stereotype.Service;

import java.util.List;


public interface QuestionService {
    //Question findQuestion(String username, int questionNumber);

    //void saveQuestion(Question question);

    List<Question> findAll(String username);
}
