package com.moeAlfarra.Smart_Library_Management_System.entity;

public enum BookTag {
    BESTSELLER("Bestseller"),
    NEW_ARRIVAL("New Arrival"),
    STAFF_PICK("Staff Pick"),
    TRENDING("Trending"),
    AWARD_WINNER("Award Winner"),
    CLASSIC("Classic"),
    MOVIE_ADAPTATION("Movie Adaptation"),
    HIDDEN_GEM("Hidden Gem"),
    POPULAR("Popular"),
    RECOMMENDED("Recommended");

    private final String displayName;

    BookTag(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
