package com.moeAlfarra.Smart_Library_Management_System.entity;

public enum BookCategory {
    FICTION("Fiction"),
    SCIENCE("Science"),
    HISTORY("History"),
    TECHNOLOGY("Technology"),
    BIOGRAPHY("Biography"),
    MYSTERY("Mystery"),
    ROMANCE("Romance"),
    FANTASY("Fantasy"),
    HORROR("Horror"),
    SELF_HELP("Self Help"),
    BUSINESS("Business"),
    POETRY("Poetry"),
    CHILDREN("Children"),
    RELIGION("Religion"),
    GENERAL("General");


    private final String displayName;

    BookCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
