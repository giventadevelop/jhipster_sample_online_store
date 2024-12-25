package com.mycompany.myapp.security.oauth2;

import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.User.SocialType;
import com.mycompany.myapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(new OAuth2Error("processing_error", "Failed to process OAuth2 user", null), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        return userRepository
            .findOneByEmailIgnoreCase(email)
            .map(existingUser -> updateExistingUser(existingUser, oauth2User))
            .map(user -> new CustomOAuth2User(user, oauth2User.getAttributes()))
            .orElseGet(() -> {
                User newUser = registerNewUser(userRequest, oauth2User);
                return new CustomOAuth2User(newUser, oauth2User.getAttributes());
            });
    }

    private User registerNewUser(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        User user = new User();

        user.setEmail(oauth2User.getAttribute("email"));
        user.setFirstName(oauth2User.getAttribute("given_name"));
        user.setLastName(oauth2User.getAttribute("family_name"));
        user.setSocialType(determineSocialType(userRequest));
        user.setSocialId(oauth2User.getAttribute("sub"));
        user.setActivated(true);
        user.setLogin(oauth2User.getAttribute("email")); // Using email as login for social users

        return userRepository.save(user);
    }

    private User updateExistingUser(User user, OAuth2User oauth2User) {
        user.setFirstName(oauth2User.getAttribute("given_name"));
        user.setLastName(oauth2User.getAttribute("family_name"));
        return userRepository.save(user);
    }

    private SocialType determineSocialType(OAuth2UserRequest userRequest) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        return switch (registrationId.toLowerCase()) {
            case "google" -> SocialType.GOOGLE;
            case "facebook" -> SocialType.FACEBOOK;
            default -> SocialType.LOCAL;
        };
    }
}
