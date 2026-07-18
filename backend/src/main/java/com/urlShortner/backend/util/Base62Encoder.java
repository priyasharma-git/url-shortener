package com.urlShortner.backend.util;

public class Base62Encoder {

    private static final String CHARACTERS =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static String encode(Long value) {

        StringBuilder result = new StringBuilder();

        while (value > 0) {
            int remainder = (int) (value % 62);
            result.append(CHARACTERS.charAt(remainder));
            value = value / 62;
        }

        return result.reverse().toString();
    }
}