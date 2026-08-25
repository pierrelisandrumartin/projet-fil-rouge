package com.example.demo.integration;

import com.example.demo.client.JikanClient;
import com.example.demo.client.MangaDexClient;
import com.example.demo.dto.jikan.JikanImage;
import com.example.demo.dto.jikan.JikanImageContainer;
import com.example.demo.dto.jikan.JikanManga;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @LocalServerPort private int port;

    @MockitoBean private JikanClient jikanClient;
    @MockitoBean private MangaDexClient mangaDexClient;


    @Test
    void fullFlow_shouldRegisterLoginImportAndRemove() {
        RestClient client = RestClient.builder()
                .baseUrl("http://localhost:" + port)
                .build();

        // ── 1. Register ────────────────────────────────────────────────
        var registerBody = client.post()
                .uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "username", "alice",
                        "email", "alice@test.com",
                        "password", "strongpass123"
                ))
                .retrieve()
                .body(Map.class);

        assertThat(registerBody).isNotNull();
        String token = (String) registerBody.get("token");
        assertThat(token).isNotBlank();

        // ── 2. Mock Jikan to return a fake manga ───────────────────────
        JikanImage jpg = new JikanImage();
        jpg.setLargeImageUrl("https://example.com/onepiece.jpg");
        JikanImageContainer images = new JikanImageContainer();
        images.setJpg(jpg);

        JikanManga fakeManga = new JikanManga();
        fakeManga.setMalId(1);
        fakeManga.setTitle("One Piece");
        fakeManga.setSynopsis("Adventure of a rubber pirate");
        fakeManga.setStatus("Publishing");
        fakeManga.setType("Manga");
        fakeManga.setChapters(1120);
        fakeManga.setVolumes(104);
        fakeManga.setImages(images);

        when(jikanClient.getMangaById(1)).thenReturn(fakeManga);

        // ── 3. Import — needs Bearer token ─────────────────────────────
        var importBody = client.post()
                .uri("/api/works/import")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("externalId", "1", "source", "jikan"))
                .retrieve()
                .body(Map.class);

        assertThat(importBody).isNotNull();
        assertThat(importBody.get("title")).isEqualTo("One Piece");

        // ── 4. Get library ─────────────────────────────────────────────
        List<?> library = client.get()
                .uri("/api/works/my")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(List.class);

        assertThat(library).isNotNull().hasSize(1);
        Map<?, ?> firstItem = (Map<?, ?>) library.get(0);
        assertThat(firstItem.get("title")).isEqualTo("One Piece");

        Integer progressId = (Integer) firstItem.get("progressId");
        assertThat(progressId).isNotNull();

        // ── 5. Delete progress ─────────────────────────────────────────
        var deleteResponse = client.delete()
                .uri("/api/progress/" + progressId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .toBodilessEntity();

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        // ── 6. Library should now be empty ─────────────────────────────
        List<?> libraryAfter = client.get()
                .uri("/api/works/my")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(List.class);

        assertThat(libraryAfter).isNotNull().isEmpty();
    }
}