package com.rentmatch.app.controller;

import com.rentmatch.app.entity.Question;
import com.rentmatch.app.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api")
public class QuestionController {
    private QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/answers")
    public List<Question> getQuestions(Principal principal) {
        String loggedUser = principal.getName();
        return questionService.findAll(loggedUser);
    }

    @GetMapping("/answers/{questionNum}")
    public Question getQuestion(@PathVariable int questionNum, Principal principal) {
        String loggedUser = principal.getName();
        if (loggedUser != null) {
            return questionService.findQuestion(loggedUser, questionNum);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "question not answered");
        }
    }

    @PostMapping("/answers")
    public ResponseEntity<String> setQuestion(@RequestBody Question question, Principal principal) {
        String loggedUser = principal.getName();
        if (loggedUser != null) {
            Question dbQuestion = questionService.findQuestion(loggedUser, question.getQuestion());
            if (dbQuestion != null) {
                dbQuestion.setAnswer(question.getAnswer());
                dbQuestion.setWeight(question.getWeight());
            } else {
                dbQuestion = new Question(question.getQuestion(), question.getAnswer(), question.getWeight(), loggedUser);
            }
            questionService.saveQuestion(dbQuestion);
            return ResponseEntity.ok("Question updated");
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }



}
