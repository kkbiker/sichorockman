package com.example.youtubelockman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class YoutubeLockmanApplication {

	public static void main(String[] args) {
		SpringApplication.run(YoutubeLockmanApplication.class, args);
	}

}
