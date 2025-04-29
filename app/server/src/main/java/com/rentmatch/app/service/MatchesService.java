package com.rentmatch.app.service;

import com.rentmatch.app.dao.ProfileRepository;
import com.rentmatch.app.dao.SubmittedUserRepository;
import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.Profile;
import com.rentmatch.app.entity.Question;
import com.rentmatch.app.entity.SubmittedUser;
import com.rentmatch.app.entity.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchesService {
    private QuestionService questionService;
    private UserRepository userRepository;
    private ProfileRepository profileRepository;
    private SubmittedUserRepository submittedUserRepository;

    private static final double EARTH_RADIUS_MILES = 3958.8; // Earth radius in miles
    private static final double maxMatchRunningScore = 20;
    private static int[] optionsPerQuestion = {4, 2};

    public MatchesService(QuestionService questionService, UserRepository userRepository, ProfileRepository profileRepository, SubmittedUserRepository submittedUserRepository) {
        this.questionService = questionService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.submittedUserRepository = submittedUserRepository;
    }

    public Hashtable<User, Double> findMatches(User user, int range){
        Hashtable<User, Double> matches = new Hashtable<>();
        List<User> closeMatches = findMatchesByDistance(user, range);
        for(User u: closeMatches){
            double score = calculateMatchScore(user, u);
            score *= 100;
            score = Math.round(score);
            score /= 100;
            matches.put(u, score);
        }
        return matches;
    }

    private double calculateMatchScore(User user1, User user2) {
        List<Question> userQuestions = questionService.findAll(user1.getUsername());
        List<Question> matchUserQuestions = questionService.findAll(user2.getUsername());
        double runningScore = 0;
        double runningScoreMatch = 0;
        for(int i = 0; i < userQuestions.size(); i++){
            Question question = userQuestions.get(i);
            Question matchUserQuestion = matchUserQuestions.get(i);
            int userAnswer = question.getAnswer();
            double userWeight = question.getWeight() / 100.0;
            double matchUserWeight = matchUserQuestion.getWeight() / 100.0;
            int matchUserAnswer = matchUserQuestion.getAnswer();
            double diffOption = Math.abs(userAnswer - matchUserAnswer);
            double percentageDiff = diffOption / optionsPerQuestion[i];
            runningScore += (10 - (percentageDiff * 10) * userWeight);
            runningScoreMatch += (10 - (percentageDiff * 10) * matchUserWeight);
        }
        return ((runningScore + runningScoreMatch) / 2) / maxMatchRunningScore * 100;
    }

    private void sortArrays(List<String> usernames, List<Double> userScores){

    }

    private List<User> findMatchesByDistance(User user, double distance) {
        List<SubmittedUser> submittedUsers = submittedUserRepository.findAll();
        List<Profile> matches = new ArrayList<>();
        Profile userProfile = null;
        for (SubmittedUser submittedUser : submittedUsers) {
            Optional<Profile> submittedUserProfile = profileRepository.findByUsername(submittedUser.getUsername());
            if(!submittedUserProfile.isPresent()){
                continue;
            }
            Profile matchProfile = submittedUserProfile.get();
            if(!matchProfile.getUsername().equals(user.getEmail())){
                matches.add(matchProfile);
            }else{
                userProfile = matchProfile;
            }
        }
        if(userProfile == null){
            return new ArrayList<>();
        }

        List<User> matchUsers = new ArrayList<>();
        String username = userProfile.getUsername();
        double latitude1 = userProfile.getLatitude();
        double longitude1 = userProfile.getLongitude();
        for (Profile matchProfile : matches) {
            String profileUsername = matchProfile.getUsername();
            if(!username.equals(profileUsername)) {
                double distanceToUser = distance(latitude1, longitude1, matchProfile.getLatitude(), matchProfile.getLongitude());
                if (distanceToUser <= distance) {
                    Optional<User> matchUser = userRepository.findByEmail(profileUsername);
                    if (!matchUser.isPresent()) {
                        continue;
                    }
                    matchUsers.add(matchUser.get());
                }
            }
        }
        return matchUsers;
    }

    private static double distance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        lat1 = Math.toRadians(lat1);
        lat2 = Math.toRadians(lat2);

        double a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        double c = 2 * Math.asin(Math.sqrt(a));
        return EARTH_RADIUS_MILES * c;
    }


}
