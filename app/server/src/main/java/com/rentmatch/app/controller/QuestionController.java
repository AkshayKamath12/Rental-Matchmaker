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
    @GetMapping("/questions")
    public List<Question> getQuestions() {
        System.out.println(getLoggedUser());
        return questionService.findAll("john");
    }
    /*
    @GetMapping("/answer/{questionNum}")
    public Question getQuestion(@PathVariable int questionNum) {
        String loggedUser = "john";
        if (loggedUser != null) {
            return questionService.findQuestion(loggedUser, questionNum);
        }else {
            return null;
        }
    }

    @PostMapping("/answer")
    public void setQuestion(@RequestBody Question question) {
        String loggedUser = getLoggedUser();
        if (loggedUser != null) {
            questionService.saveQuestion(question);
        }
    }
    */


}
