import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  children: ReactNode;
};

export function ScreenContainer({ children }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
