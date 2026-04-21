-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : mar. 17 mars 2026 à 14:40
-- Version du serveur : 8.0.45
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bdd_manga`
--
DROP DATABASE IF EXISTS bdd_manga;
CREATE DATABASE IF NOT EXISTS `bdd_manga` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bdd_manga`;

-- --------------------------------------------------------

--
-- Structure de la table `authors`
--

CREATE TABLE `authors` (
  `id` int NOT NULL ,
  `name` char(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` char(30) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `progress`
--

CREATE TABLE `progress` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `work_id` int NOT NULL,
  `current_volume` int NOT NULL,
  `current_chapter` int NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` char(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` char(30) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` char(60) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users_list`
--

CREATE TABLE `users_list` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `work_id` int NOT NULL,
  `status` char(50) COLLATE utf8mb4_general_ci NOT NULL,
  `added_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `works`
--

CREATE TABLE `works` (
  `id` int NOT NULL,
  `title` char(50) COLLATE utf8mb4_general_ci NOT NULL,
  `synopsis` text COLLATE utf8mb4_general_ci NOT NULL,
  `cover_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` char(20) COLLATE utf8mb4_general_ci NOT NULL,
  `total_volumes` int NOT NULL,
  `total_chapters` int NOT NULL,
  `category_id` int NOT NULL,
  `author_id` int NOT NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);


--
-- Index pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);



--
-- Index pour la table `works`
--

ALTER TABLE `works`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`),
    ADD CONSTRAINT FK_WorksAuthor FOREIGN KEY (`author_id`) 
    REFERENCES `authors`(`id`),
  ADD CONSTRAINT FK_WorksCategory FOREIGN KEY (`category_id`)
    REFERENCES `categories`(`id`);


--
-- Index pour la table `progress`
--

ALTER TABLE `progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`),
  ADD CONSTRAINT FK_ProgressWork FOREIGN KEY (`work_id`)
    REFERENCES `works`(`id`),
  ADD CONSTRAINT FK_ProgressUser FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`);

--
-- Index pour la table `users_list`
--

ALTER TABLE `users_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`),
  ADD CONSTRAINT FK_UsersUser FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`),
  ADD CONSTRAINT FK_UsersWork FOREIGN KEY (`work_id`)
    REFERENCES `works`(`id`);



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
