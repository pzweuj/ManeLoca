import os
import pandas as pd

def merge_bed(exon_bed, intron_bed, output_bed):
    df_exon = pd.read_csv(exon_bed, sep="\t", header=0)
    df_intron = pd.read_csv(intron_bed, sep="\t", header=0)

    df_exon["location"] = df_exon["location"].astype(str).map(lambda x: "exon" + x)
    df_intron["location"] = df_intron["location"].astype(str).map(lambda x: "intron" + x)

    # 合并
    df_merged = pd.concat([df_exon, df_intron])
    df_sort = df_merged.sort_values(by=["#chrom", "start"], ascending=[True, True])
    df_sort.to_csv(output_bed, sep="\t", index=False, header=None)

if not os.path.exists("public/data"):
    os.makedirs("public/data")


merge_bed(
    "ManeSelectedBed/GRCh37/Gencode.GRCh37.exon.cor.bed",
    "ManeSelectedBed/GRCh37/Gencode.GRCh37.intron.bed",
    "public/data/GRCh37.bed"
)
merge_bed(
    "ManeSelectedBed/GRCh38/Gencode.GRCh38.exon.cor.bed",
    "ManeSelectedBed/GRCh38/Gencode.GRCh38.intron.bed",
    "public/data/GRCh38.bed"
)

