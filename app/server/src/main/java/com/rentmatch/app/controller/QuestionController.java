package com.rentmatch.app.controller;


import com.rentmatch.app.entity.Question;
import com.rentmatch.app.service.QuestionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionController {
    private QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    private String getLoggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return null;
    }
    @GetMapping("/answers")
    public List<Question> getQuestions() {
        String loggedUser = getLoggedUser();
        return questionService.findAll(loggedUser);
    }

    @GetMapping("/answers/{questionNum}")
    public Question getQuestion(@PathVariable int questionNum) {
        String loggedUser = getLoggedUser();
        if (loggedUser != null) {
            return questionService.findQuestion(loggedUser, questionNum);
        }else {
            return null;
        }
    }

    @PostMapping("/answers")
    public void setQuestion(@RequestBody Question question) {
        String loggedUser = getLoggedUser();
        question.setUsername(loggedUser);
        if (loggedUser != null) {
            questionService.saveQuestion(question);
        }
    }



}
