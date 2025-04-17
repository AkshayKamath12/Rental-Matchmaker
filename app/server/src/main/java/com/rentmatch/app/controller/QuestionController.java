package com.rentmatch.app.controller;


import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.Question;
import com.rentmatch.app.entity.User;
import com.rentmatch.app.service.QuestionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class QuestionController {
    private QuestionService questionService;
    private UserRepository userRepository;

    public QuestionController(QuestionService questionService, UserRepository userRepository) {
        this.questionService = questionService;
        this.userRepository = userRepository;
    }

    private String getLoggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String name = auth.getName();
            Optional<User> foundUser = userRepository.findByUsernameOrEmail(name, name);
            if (foundUser.isPresent()) {
                return foundUser.get().getUsername();
            }
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
        if (loggedUser != null) {
            Question dbQuestion = questionService.findQuestion(loggedUser, question.getQuestion());
            if (dbQuestion != null) {
                dbQuestion.setAnswer(question.getAnswer());
                dbQuestion.setWeight(question.getWeight());
            } else {
                dbQuestion = new Question(question.getQuestion(), question.getAnswer(), question.getWeight(), loggedUser);
            }

            questionService.saveQuestion(dbQuestion);
        }
    }



}
