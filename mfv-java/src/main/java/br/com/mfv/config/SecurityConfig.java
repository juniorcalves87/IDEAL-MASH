package br.com.mfv.config;
import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.web.builders.HttpSecurity; import org.springframework.security.web.SecurityFilterChain;
@Configuration public class SecurityConfig { @Bean SecurityFilterChain filter(HttpSecurity http)throws Exception{return http.csrf(c->c.disable()).authorizeHttpRequests(a->a.requestMatchers("/api/**","/h2-console/**").permitAll().anyRequest().authenticated()).headers(h->h.frameOptions(f->f.sameOrigin())).build();}}
