-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: mysql
-- Üretim Zamanı: 09 Eyl 2025, 22:50:09
-- Sunucu sürümü: 8.4.5
-- PHP Sürümü: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `exam_ai_demo`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `demo_emails`
--

CREATE TABLE `demo_emails` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `exam_images`
--

CREATE TABLE `exam_images` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `image_blob` longblob NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filetype` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `upload_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('uploaded','processing','processed','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'uploaded',
  `ocr_result_id` int UNSIGNED DEFAULT NULL,
  `error_message` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `job_logs`
--

CREATE TABLE `job_logs` (
  `id` int UNSIGNED NOT NULL,
  `ocr_job_id` int UNSIGNED NOT NULL,
  `event_type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `log_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ocr_jobs`
--

CREATE TABLE `ocr_jobs` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `exam_image_id` int UNSIGNED NOT NULL,
  `status` enum('waiting','processing','done','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `webhook_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ocr_results`
--

CREATE TABLE `ocr_results` (
  `id` int UNSIGNED NOT NULL,
  `exam_image_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `ocr_text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `ai_analysis` longtext COLLATE utf8mb4_unicode_ci,
  `processed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processing_time_ms` int UNSIGNED DEFAULT NULL,
  `webhook_status` enum('waiting','success','fail') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `webhook_response` longtext COLLATE utf8mb4_unicode_ci,
  `feedback` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `session_token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_demo_user` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_active_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `demo_emails`
--
ALTER TABLE `demo_emails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_demo_email_user` (`user_id`);

--
-- Tablo için indeksler `exam_images`
--
ALTER TABLE `exam_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_exam_images_ocr_result` (`ocr_result_id`),
  ADD KEY `idx_exam_images_user` (`user_id`),
  ADD KEY `idx_exam_images_status` (`status`);

--
-- Tablo için indeksler `job_logs`
--
ALTER TABLE `job_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job_logs_ocr_job` (`ocr_job_id`);

--
-- Tablo için indeksler `ocr_jobs`
--
ALTER TABLE `ocr_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ocr_jobs_user` (`user_id`),
  ADD KEY `idx_ocr_jobs_exam_image` (`exam_image_id`);

--
-- Tablo için indeksler `ocr_results`
--
ALTER TABLE `ocr_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ocr_results_user` (`user_id`),
  ADD KEY `idx_ocr_results_exam_image` (`exam_image_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_users_session_token` (`session_token`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `demo_emails`
--
ALTER TABLE `demo_emails`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `exam_images`
--
ALTER TABLE `exam_images`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `job_logs`
--
ALTER TABLE `job_logs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `ocr_jobs`
--
ALTER TABLE `ocr_jobs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `ocr_results`
--
ALTER TABLE `ocr_results`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `demo_emails`
--
ALTER TABLE `demo_emails`
  ADD CONSTRAINT `fk_demo_email_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `exam_images`
--
ALTER TABLE `exam_images`
  ADD CONSTRAINT `fk_exam_images_ocr_result` FOREIGN KEY (`ocr_result_id`) REFERENCES `ocr_results` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_exam_images_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `job_logs`
--
ALTER TABLE `job_logs`
  ADD CONSTRAINT `fk_job_logs_ocr_job` FOREIGN KEY (`ocr_job_id`) REFERENCES `ocr_jobs` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `ocr_jobs`
--
ALTER TABLE `ocr_jobs`
  ADD CONSTRAINT `fk_ocr_jobs_exam_image` FOREIGN KEY (`exam_image_id`) REFERENCES `exam_images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ocr_jobs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `ocr_results`
--
ALTER TABLE `ocr_results`
  ADD CONSTRAINT `fk_ocr_results_exam_image` FOREIGN KEY (`exam_image_id`) REFERENCES `exam_images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ocr_results_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
