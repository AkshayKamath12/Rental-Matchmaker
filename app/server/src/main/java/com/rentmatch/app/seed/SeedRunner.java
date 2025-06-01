package com.rentmatch.app.seed;

import com.rentmatch.app.dao.RoleRepository;
import com.rentmatch.app.entity.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SeedRunner implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private static final Logger logger = LoggerFactory.getLogger(SeedRunner.class);

    public SeedRunner(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Seeding Roles....");

        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            logger.info("Role User not found");
            roleRepository.save(new Role("ROLE_USER"));
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            logger.info("Role Admin not found");
            roleRepository.save(new Role("ROLE_ADMIN"));
        }
    }
}
