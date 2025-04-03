package com.rentmatch.app.dao;

import com.rentmatch.app.entity.Question;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuestionDAOImpl implements QuestionDAO {
    private EntityManager em;

    public QuestionDAOImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public Question findQuestion(String username, int questionNumber) {
        TypedQuery<Question> query = em.createQuery("From Question where username=:username AND answer=:questionNumber", Question.class);
        query.setParameter("username", username);
        query.setParameter("questionNumber", questionNumber);
        List<Question> questions = query.getResultList();
        if (!questions.isEmpty()) {
            return questions.getFirst();
        }else{
            return null;
        }
    }


    @Override
    public void saveQuestion(Question question) {
        em.merge(question);
    }

    @Override
    public List<Question> findAllQuestions(String username) {
        TypedQuery<Question> query = em.createQuery("From Question where username=:username", Question.class);
        query.setParameter("username", username);
        return query.getResultList();
    }
}
